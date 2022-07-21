import { createStore, applyMiddleware } from "https://unpkg.com/redux@4.0.5/es/redux.mjs";
import { eventOnFirstButton, eventCloseButtonModel, named_constant } from "./handlersEvents.js";//my module
/**
 * OBBIETTIVO :creare un form che quando viene inviato a un playload di tipo testo
 * quindi gli diamo un input di tipo text
 */

//NAMED CONSTANT 
const FORM_SENT = 'FORM_SENT' //azione che viene inviata quando utente invia form
//7 start GESTIONE BAD WORD
const BAD_WORD="BAD_WORD"
//ACTION CREATORS

//payload è la stringa che l utente inserisce nel form
function formSent(payload) {
    return {
        type: FORM_SENT,
        payload //sintassi jsx nome riferimento viene assegnato contenuto riferimento come payload:payload
                
    }
}
//7.1
function badWord(){
    return{
        type:BAD_WORD
    }
}

// 1 INIZIALIZZIAMO LO STATE

const initialState = {
    formSent: 'no',
    badWord:'no'//7.2 qunado l utente inserisce una enne nel testo vogliamo stampare un messaggio 
    //l evento cambia in yes questa prop attraverso il dispatch
}

//5 CREIAMO IL MIDDLWARE 
//funzione che non accetta le lettere N
/**
 * 
 * @param {*} store -->le tre funzioni dello store a disposizione getstate - dispatch - subscribe
 * @param {*} action 
 * @returns function(next){ --->next riferimento a un altra funzione che manda forza l app ad andare avanti
 *              return function(action){
 *                  }           
 *            }
 */
//quindi possiamo destrutturare dallo store le funzioni che ci servono 

function noNmiddleWare({getState,dispatch}){
    return function(next){
        return function(action){
            console.log(action)
            //7.5 tutte le action passano da tutti i middleWare se presenti quindi aggiungiamo condizione 
           if(action.type===FORM_SENT){
            //utente a iniviato il form
            if(action.payload.includes('n')){
                //form non accettato
                //cambiamo lo stato notificando allo store la badword
                dispatch(badWord())
            }
           }
            return next(action)
        }//closure
    }
}


// 2 CREIAMO IL REDUCER
function rootReducer(state = initialState, action) {

    switch (action.type) {
        
        case FORM_SENT:
            return { ...state, formSent: 'yes' }
        case BAD_WORD:
            return {...state,badWord:'yes'}//7.3 sottoscriviamo la ui
        default:
            return state;

    }

}
//3 CREIAMO LO STORE CHE PRENDE LA REFERENZA DEL REDUCER
//
const dev_Tool = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
                                        //6 aggiungiamo il middleware le referenze interne alla funzione rispetto l ordine di firma
const store = createStore(rootReducer, applyMiddleware(noNmiddleWare))

// 4 GESTIONE INVIO FORM
function handleSumbit (event){//ci serve il this per recuperare l elemento html che ha generato l evento
    event.preventDefault()
    //obbiettivo recupero testo inserito nel form e inserilo nel payload
    //creo oggetto data da cui recuperarlo
    const data=new FormData(this)//quindi il this corrisponde al form
    const payload=data.get('name_word')
    //invio messaggio

    store.dispatch(formSent(payload))

}

const form=document.forms[0]
form.addEventListener('submit',handleSumbit)

store.subscribe(function () {

    if (store.getState().badWord === 'yes') {//check state  
        //creiamo un nuovo elemento html con avviso

        const h3=document.createElement('h3')
       
        document.body.appendChild(h3)
        h3.innerText='errore'
    }
})



