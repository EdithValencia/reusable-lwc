public with sharing class BoatDataService {

    @AuraEnabled
    public static List<BoatReview__c> getAllReviews(Id boatId) {
        String queryTemplate = 'SELECT Id, Name, Comment__c, Rating__c, LastModifiedDate, CreatedDate, CreatedBy.Name,' +
                                'CreatedBy.SmallPhotoUrl, CreatedBy.CompanyName, Is_Moderated__c, Boat__r.Name ' +
                                'FROM BoatReview__c {0} WITH SECURITY_ENFORCED ORDER BY CreatedDate DESC';

        String query = String.format(queryTemplate, boatId == null ? new List<String> {''} : new List<String> {'WHERE Boat__c = :boatId'});

        return Database.query(query);
    }
}