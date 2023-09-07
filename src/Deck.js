import React, { useEffect, useState } from "react";
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

            setEmpty(!empty)

        } else {

            res.data.cards[0]["id"] = uuidv4()
            addToDeck((deck) => [...deck, res.data.cards[0]])

        }

    }

    if (!deckId) {
        return <h3>Loading...</h3>
    }

    return(
        <>

            {empty ? <div><h1> Out of Cards</h1></div> : <div><h1>Draw A Card!</h1><button onClick={draw}>Draw</button></div>}

            <div className="card-area">

                {deck.map(c => <Card key={c.id} image={c.image}/>)}

            </div>

        </>
    )
}

export default Deck;