declare const routes: {
    admin: {
        type: string;
        routes: ({
            method: string;
            path: string;
            handler: string;
            config: {
                policies: any[];
                prefix: boolean;
                auth?: undefined;
                description?: undefined;
            };
        } | {
            method: string;
            path: string;
            handler: string;
            config: {
                auth: boolean;
                prefix: boolean;
                policies?: undefined;
                description?: undefined;
            };
        } | {
            method: string;
            path: string;
            handler: string;
            config: {
                auth: boolean;
                prefix: boolean;
                description: string;
                policies?: undefined;
            };
        } | {
            method: string;
            path: string;
            handler: string;
            config: {
                prefix: boolean;
                policies?: undefined;
                auth?: undefined;
                description?: undefined;
            };
        } | {
            method: string;
            path: string;
            handler: string;
            config: {
                policies: any[];
                prefix: boolean;
                auth: boolean;
                description?: undefined;
            };
        } | {
            method: string;
            path: string;
            handler: string;
            config: {
                policies: any[];
                prefix: boolean;
                description: string;
                auth?: undefined;
            };
        })[];
    };
    'content-api': {
        type: string;
        routes: {
            method: string;
            path: string;
            handler: string;
            config: {
                description: string;
                policies: any[];
            };
        }[];
    };
};
export default routes;
