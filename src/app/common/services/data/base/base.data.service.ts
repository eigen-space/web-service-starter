// @ts-ignore
import * as fetch from 'node-fetch';
import { RequestMethod } from '../../../enums/request-method.enum';
import { AnyDictionary, Dictionary } from '@eigenspace/common-types';
import { environment } from '../../../../../environments/environment';

export class BaseDataService {
    private baseUrl = environment.apiUrls.base;

    protected get(url: string, params: AnyDictionary = {}, options?: AnyDictionary): Promise<AnyDictionary> {
        return this.request(url, RequestMethod.GET, params, undefined, options);
    }

    protected post(
        url: string,
        params: AnyDictionary = {},
        data: AnyDictionary,
        options?: AnyDictionary
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> {
        return this.request(url, RequestMethod.POST, params, data, options);
    }

    protected put(
        url: string,
        params: AnyDictionary = {},
        data: AnyDictionary,
        options?: AnyDictionary
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> {
        return this.request(url, RequestMethod.PUT, params, data, options);
    }

    private async request(
        fragmentUrl: string,
        method: RequestMethod,
        params: AnyDictionary = {},
        data?: AnyDictionary,
        options: AnyDictionary = {}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> {
        let url = this.createUrl(this.baseUrl, fragmentUrl, params, options);
        // Anti-cache
        url += `${(!url.includes('?') ? '?' : '&')}_=${Date.now()}`;

        let body: string | undefined;
        let headers: Dictionary<string> = {};

        if (data && typeof data === 'object') {
            body = JSON.stringify(data);
            headers = {
                ...headers,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            };
        }

        const response = await fetch(url, { method, headers, body });
        return response.json();
    }

    private createUrl(
        baseUrl: string,
        fragmentUrl: string,
        params: AnyDictionary = {},
        options: AnyDictionary = {}
    ): string {
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        const matcher = (urlParams: AnyDictionary) =>
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (_: any, paramKey: string): string => urlParams[paramKey] != null ? urlParams[paramKey] : '';

        // Replace parameter placeholders and remove empty query parameters
        const url = `${baseUrl}${fragmentUrl}`;
        // Replace mocked url params
        return url.replace(/#([a-zA-Z]+)/g, matcher(options))
            .replace(/:([a-zA-Z]+)/g, matcher(params))
            .replace(/[a-zA-Z]*?=&/g, '')
            .replace(/&[a-zA-Z]*?=$/g, '')
            .replace(/\?[a-zA-Z]*?=$/g, '');
    }
}
