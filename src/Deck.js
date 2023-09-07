import React, { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from 'uuid';
import Card from "./Card"
import axios from "axios";

/*

Deck of cards

*/

function Deck() {

    const [deckId, setDeckId] = useState(null);
    const [deck, addToDeck] = useState([]);
    const [empty, setEmpty] = useState(false)
    const [drawing, setDrawing] = useState(false)
    const timerId = useRef()

    useEffect(() => {
        async function loadNewShuffledDeck() {
            const res = await axios.get(`https://deckofcardsapi.com/api/deck/new`)
            setDeckId(res.data.deck_id)
            await axios.get(`https://deckofcardsapi.com/api/deck/${res.data.deck_id}/shuffle/`)
        }
        loadNewShuffledDeck()
    },[])

    const draw = async () => {

        const res = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`)

        if (!res.data.success) {

            setEmpty(empty => !empty)

        } else {

            res.data.cards[0]["id"] = uuidv4()
            addToDeck((deck) => [...deck, res.data.cards[0]])

        }

    }

    useEffect(() => {

        if (!drawing) {

            return

        }

        timerId.current = setInterval(() => {
            draw()
        }, 1000)

        return () => clearInterval(timerId.current)

    }, [drawing])

    const stopDraw = () => {

        setDrawing(false)
        clearInterval(timerId.current)

    }

    const startDraw = () => {
        setDrawing(true)
    }

    if (!deckId) {
        return <h3>Loading...</h3>
    }

    if (empty) {
        clearInterval(timerId.current)
    }

    return(
        <>

            <div>

            {empty ? <h1>Out of Cards</h1>  : <h1>Let's Play</h1>}

            {!empty && !drawing && <button onClick={startDraw}>Start Drawing</button>}
            {!empty && drawing && <button onClick={stopDraw}>Stop Drawing</button>}

            </div>

            <div className="card-area">

                {deck.map(c => <Card key={c.id} image={c.image}/>)}

            </div>

        </>
    )
}

export default Deck;