declare const routes: {
    method: string;
    path: string;
    handler: string;
    config: {
        description: string;
        policies: any[];
    };
}[];
export default routes;
