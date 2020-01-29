import * as express from 'express';
import { environment } from '../../../environments/environment';
import { IssueController } from '../controllers/issue.controller';

export const IssueRouter = express.Router();

const issueController = new IssueController();

IssueRouter.get(environment.apiUrls.issues.getIssue, issueController.getIssue);

IssueRouter.put(environment.apiUrls.issues.editIssue, issueController.editIssue);
