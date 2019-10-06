import React, { useState, useMemo } from 'react' //useMemo para criação de preview, observa valor da variavel e toda vez que ela mudar, ele atualiza o valor
import api from '../../services/api'

import camera from '../../assets/camera.svg'


import './styles.css'


export default function New( { history }){
    //criar preview de imagem 
    const [ thumbnail, setThumbnail ] = useState('')

    // 
    const [company, setCompany ] = useState('')
    const [ techs, setTechs ] = useState('')
    const [ price, setPrice ] = useState('')
    
    //preview
    const preview = useMemo(()=>{
        return thumbnail ? URL.createObjectURL(thumbnail) : null
    },
        [ thumbnail ]
    )
    
    


    async function handleSubmit(event){
        //previnir o comportamento do form 
        event.preventDefault()

        //multiformPart
        const data = new FormData()
        const user_id = localStorage.getItem('user')

        data.append('thumbnail', thumbnail)
        data.append('company', company)
        data.append('techs', techs)
        data.append('price', price)

        //const response = await api.post
        await api.post('/spots', data, {
            headers: { user_id }
        })

        history.push('/dashboard')

    }


    return (
        <form onSubmit={handleSubmit}>
            <label 
            id="thumbnail" 
            style={{ backgroundImage: `url(${preview})`}}
            class={thumbnail ? 'has-thumbnail' : ''}
            >
                <input type="file" onChange={event => setThumbnail(event.target.files[0])} />
                <img src={camera} alt="Select img"/>
            </label>
            <label htmlFor="company">EMPRESA *</label>
            <input
                id="company"
                placeholder="Sua empresa incrivel"
                value={company}
                onChange={event => setCompany(event.target.value)}
            />
            <label htmlFor="techs">TECNOLOGIAS <span>(separadas por virgula)</span></label>
            <input
                id="techs"
                placeholder="Suas tecnologias"
                value={techs}
                onChange={event => setTechs(event.target.value)}
            />
            <label htmlFor="price">VALOR DA DIÁRIA <span>(em branco é gratuito)</span></label>
            <input
                id="price"
                placeholder="Valor cobrado por dia"
                value={price}
                onChange={event => setPrice(event.target.value)}
            />
            <button type="submit" className="btn">Cadastrar</button>
        </form>

    )

}