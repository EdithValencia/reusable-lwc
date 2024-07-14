import { LightningElement, api } from 'lwc';
import detailedReview from './detailedReview.html';
import actionReview from './actionReview.html';
import summaryReview from './summaryReview.html';

export default class BoatReview extends LightningElement {
    @api boatReview;
    @api reviewDisplayType;
    
    //Conditionally render a template based on the reviewDisplayType value
    render() {
        if(this.reviewDisplayType === 'Detailed') {
            return detailedReview;
        } else if(this.reviewDisplayType === 'Action') {
            return actionReview;
        } else if(this.reviewDisplayType === 'Summary') {
            return summaryReview;
        }
        return actionReview;
    }

    handleOpenReview() {
        const reviewId = this.boatReview.Id;
        const review = {
            Id: reviewId
        };
        this.dispatchEvent(new CustomEvent('openreview', {detail: review}));
    }

}