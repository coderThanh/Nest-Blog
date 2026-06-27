import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDataFindAllMeta, ApiResponseOkDto } from '@/shared/dto/response.dto';
import { Type, applyDecorators } from '@nestjs/common';

export const ApiCustomResponseOK = <TModel extends Type<any>>(
  model: TModel,
) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseOkDto) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
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
