declare const routes: ({
    method: string;
    path: string;
    handler: string;
    config: {
        description: string;
        policies: any[];
        prefix: boolean;
    };
} | {
    method: string;
    path: string;
    handler: string;
    config: {
        description: string;
        policies: any[];
        prefix?: undefined;
    };
})[];
export default routes;
