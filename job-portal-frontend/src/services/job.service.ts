export default class JobService {
  // ... existing code ...

  // Update the response type handling for application details
  public getApplicationDetails(applicationId: string): Promise<any> {
    return this.http.get(`/applications/${applicationId}`);
  }
  
  // ... existing code ...
} 