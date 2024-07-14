import { LightningElement, api, wire, track} from 'lwc';
import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';
import { publish, MessageContext } from 'lightning/messageService';
import REVIEWMC from '@salesforce/messageChannel/ReviewMessageChannel__c';

export default class BoatReviews extends LightningElement {
    @api reviewDisplayType;    

    // This is the message context object that is used to publish the message to the message channel
    @wire(MessageContext)
    messageContext;

    //This is called when the user clicks on the open review button in the child component, through the event handler
    handleOpenReview(event) {
        const reviewId = event.detail.Id;

        publish(this.messageContext, REVIEWMC, { reviewId: reviewId });
    }

    connectedCallback() {
        if(!this.recordId) {
            this.getReviews();
        }
    }

    //Code to get the reviews for the boat from the server
    boatId;
    error;
    @track
    boatReviews;
    isLoading;
    
    // Getter and Setter to allow for logic to run on recordId change    
    get recordId() {
      return this.boatId;
    }
    @api
    set recordId(value) {
        console.log('Setter');
        this.setAttribute('boatId', value);        
        this.boatId = value;
        this.getReviews();
    }
    
    // Getter to determine if there are reviews to display
    get reviewsToShow() { 
        return this.boatReviews && this.boatReviews.length > 0;
    }
    
    // Public method to force a refresh of the reviews invoking getReviews
    @api
    refresh() {
        this.getReviews();
     }
    
    // Imperative Apex call to get reviews for given boat
    // returns immediately if boatId is empty or null
    // sets isLoading to true during the process and false when it’s completed
    // Gets all the boatReviews from the result, checking for errors.
    getReviews() {
        this.isLoading = true;
        getAllReviews({boatId: this.boatId}).then((result) => {
            this.boatReviews = result;
            console.log('BoatReviews.getReviews: boatReviews=' + JSON.stringify(this.boatReviews));
            this.error = undefined;
        }).catch((error) => {
            this.error = error;
        }).finally(() => {
            this.isLoading = false;
        });
  }
}
  