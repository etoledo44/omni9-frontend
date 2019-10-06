import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import socketio from 'socket.io-client' //importando o socketio para fazer a conexao 

import api from '../../services/api'


import './styles.css'

export default function Dashboard(){
    const [spots, setSpots] = useState([]) //iniciar com o tipo de varivel que esta a receber
    const [ requests, setRequests ] = useState([])

    const user_id = localStorage.getItem('user')

    const socket = useMemo(()=> socketio('http://localhost:3333',{
        query: {user_id}
    }), [user_id])  //passando o id do usuario na conexao para identificar quem esta on

    useEffect(()=>{

        // socket.on('hello', data => {
        //     console.log(data)
        // }) //toda vez que receber uma mensagem com o nome hello, vai receber o dado e printar
            // o cliente passa a ouvir a mensagem, se for do tipo hello, como definido no backend

        socket.on('booking_request', data => {
            setRequests([...requests, data ])
        })
        }, [requests, socket])

    useEffect(() => {
       async function loadSpots(){
           const user_id = localStorage.getItem('user')
           const response = await api.get('/dashboard', {
               headers: { user_id }
           });
           
           setSpots(response.data)

       } 
       loadSpots()

    }, [])

    async function handleAccept (id){
        await api.post(`/bookings/${id}/approvals`)

        setRequests(requests.filter(request => request._id !== id))

    }
    async function handleReject(id){
        await api.post(`/bookings/${id}/rejections`)

        setRequests(requests.filter(request => request._id !== id))

    }
    return (
        <>
        <ul className="notifications">
            {requests.map(request => (
                <li key={request._id}>
                    <p>
                        <strong>{request.user.email}</strong> Está solicitando uma reserva em <strong>{request.spot.company}</strong> para a data: <strong>{request.date}</strong>
                    </p>
                    <button className='accept' onClick={()=> handleAccept(request._id)}>ACEITAR</button>
                    <button className='reject' onClick={()=> handleReject(request._id)}>REJEITAR</button>
                </li>
            ))}
        </ul>

            <ul className="spot-list">
                {spots.map(spots => ( //map percorre o array 
                    <li key={spots._id}>
                        <header style={{ backgroundImage: `url(${spots.thumbnail_url})` }}/>
                        <strong>{spots.company}</strong>
                        <span>{spots.price ? `R$${spots.price}/dia` : `Gratís`}</span>
                    </li>
                ))}
            </ul>

            <Link to="/new">
                <button className="btn">
                Cadastrar novo spot
                </button>
            </Link>
        </>
    )
}