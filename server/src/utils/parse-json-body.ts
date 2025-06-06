import { Context } from 'koa';
import { ZodType, Schema, infer as ZodInfer } from 'zod';

interface ParsedRequest<
  BodySchema extends ZodType<any>,
  ParamsSchema extends ZodType<any>,
  QuerySchema extends ZodType<any>,
> {
  body?: ZodInfer<BodySchema>;
  params?: ZodInfer<ParamsSchema>;
  query?: ZodInfer<QuerySchema>;
}

export function parseRequest<BS extends ZodType<any>, PS extends ZodType<any>, QS extends ZodType<any>>(
  ctx: Context,
  bodySchema: BS | null,
  paramsSchema: PS | null,
  querySchema: QS | null
): ParsedRequest<BS, PS, QS> {
  let bodyObject;

  try {
    const requestBody = ctx.request.body;
    bodyObject = requestBody && typeof requestBody === 'object' ? requestBody : JSON.parse(requestBody);
  } catch (error) {
    // ctx.badRequest's type seems to be off - we're following the official example: https://docs.strapi.io/dev-docs/error-handling#controllers-and-middlewares
    (ctx as any).badRequest('InvalidBody', { errors: { body: 'invalid body' } });
    throw new Error('invalid-body');
  }

  const body = bodySchema?.safeParse(bodyObject);
  const params = paramsSchema?.safeParse(ctx.params);
  const query = querySchema?.safeParse(ctx.query);

  if (body && (!body.success || 'error' in body)) {
    const errorMsg =
      'error' in body && typeof body.error === 'object' && body.error && 'message' in body.error
        ? (body.error.message as string)
        : 'invalid-body';

    (ctx as any).badRequest('ValidationError', {
      errors: {
        body: errorMsg,
      },
    });

    throw new Error(errorMsg);
  }

  if (params && (!params.success || 'error' in params)) {
    const errorMsg =
      'error' in params && typeof params.error === 'object' && params.error && 'message' in params.error
        ? (params.error.message as string)
        : 'invalid-params';

    (ctx as any).badRequest('ValidationError', {
      errors: {
        params: errorMsg,
      },
    });

    throw new Error(errorMsg);
  }

  if (query && (!query.success || 'error' in query)) {
    const errorMsg =
      'error' in query && typeof query.error === 'object' && query.error && 'message' in query.error
        ? (query.error.message as string)
        : 'invalid-query';

    (ctx as any).badRequest('ValidationError', {
      errors: {
        query: errorMsg,
      },
    });

    throw new Error(errorMsg);
  }

  return {
    body: body?.data,
    params: params?.data,
    query: query?.data,
  };
}
