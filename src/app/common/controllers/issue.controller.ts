import * as express from 'express';
import { IssueDataService } from '../services/data/issue/issue.data.service';

export class IssueController {
    private issueDataService = new IssueDataService();

    getIssue = async (req: express.Request, res: express.Response): Promise<void> => {
        const issueIdOrKey = req.url.split('/').pop() as string;
        const response = await this.issueDataService.getIssue(issueIdOrKey);
        res.send(response);
    };

    editIssue = async (req: express.Request, res: express.Response): Promise<void> => {
        const issueIdOrKey = req.url.split('/').pop() as string;
        const response = await this.issueDataService.editIssue(issueIdOrKey, req.body);
        res.send(response);
    };
}