import { BaseDataService } from '../base/base.data.service';
import { AnyDictionary } from '@eigenspace/common-types';
import { environment } from '../../../../../environments/environment';

export class IssueDataService extends BaseDataService {

    getIssue(issueIdOrKey: string): Promise<AnyDictionary> {
        return this.get(environment.apiUrls.issues.getIssue, { issueIdOrKey });
    }

    editIssue(issueIdOrKey: string, fieldsToUpdate: AnyDictionary): Promise<AnyDictionary> {
        return this.put(environment.apiUrls.issues.getIssue, { issueIdOrKey }, fieldsToUpdate);
    }
}