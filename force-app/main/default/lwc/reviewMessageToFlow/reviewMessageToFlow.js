import { LightningElement, wire, api } from 'lwc';
import {APPLICATION_SCOPE, MessageContext, subscribe, unsubscribe} from "lightning/messageService";
import REVIEWMC from '@salesforce/messageChannel/ReviewMessageChannel__c';

import {
    FlowAttributeChangeEvent,
    FlowNavigationNextEvent,
} from 'lightning/flowSupport';

export default class ReviewMessageToFlow extends LightningElement {

    @api reviewId;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {        
        this.subscribeToMessageChannel();
    }

    handleMessage(message){
        console.log('MESSAGE RECEIVED');
        console.log(message);

        let reviewId = message.reviewId;

        //Sending the reviewId to the flow
        const attributeChangeEvent = new FlowAttributeChangeEvent('reviewId', reviewId);
        this.dispatchEvent(attributeChangeEvent);
        
        const navigateNextEvent = new FlowNavigationNextEvent();
        this.dispatchEvent(navigateNextEvent);
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                REVIEWMC,
                (message) => this.handleMessage(message),
                {scope: APPLICATION_SCOPE}
            );
        }
    }
    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }
}