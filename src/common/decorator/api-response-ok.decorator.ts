import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import {
  ApiResponseDataFindAllMeta,
  ApiResponseOkDto,
  ResponseFindAllDataMetaCursor,
} from '@/shared/dto/response.dto';
import { Type, applyDecorators } from '@nestjs/common';

export const ApiCustomResponseOK = <TModel extends Type<any>>(
  model: TModel | null,
) => {
  return applyDecorators(
    ApiExtraModels(ApiResponseOkDto, model ? model : () => {}),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseOkDto) },
          {
            properties: {
              data: model
                ? {
                    $ref: getSchemaPath(model),
                  }
                : {},
            },
          },
        ],
      },
    }),
  );
};

export const ApiCustomResponseOKFindAll = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(ApiResponseOkDto, ApiResponseDataFindAllMeta, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseOkDto) },
          {
            properties: {
              data: {
                properties: {
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  },
                  meta: { $ref: getSchemaPath(ApiResponseDataFindAllMeta) },
                },
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiCustomResponseOKFindAllCursor = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiExtraModels(ApiResponseOkDto, ResponseFindAllDataMetaCursor, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseOkDto) },
          {
            properties: {
              data: {
                properties: {
                  items: {
                    type: 'array',
                    items: { $ref: getSchemaPath(model) },
                  },
                  meta: {
                    $ref: getSchemaPath(ResponseFindAllDataMetaCursor),
                  },
                },
              },
            },
          },
        ],
      },
    }),
  );
};
