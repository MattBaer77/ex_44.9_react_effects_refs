import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import Card from "./Card"

/*

Deck of cards

*/

function Deck() {
    return(
        <>
            <Card/>
            <Card/>
        </>
    )
}

export default Deck;