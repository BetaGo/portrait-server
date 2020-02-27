import typeorm from 'typeorm';
import _ from 'lodash';
import { UpdateResult } from './graphql.schema';

export function generateUpdateResult(
  updateResult: typeorm.UpdateResult,
): UpdateResult;
export function generateUpdateResult(
  success: typeorm.UpdateResult,
  message?: string,
): UpdateResult;
export function generateUpdateResult(
  updateResultOrBool: typeorm.UpdateResult | boolean,
  message?: string,
): UpdateResult {
  if (typeof updateResultOrBool === 'boolean') {
    return {
      success: updateResultOrBool,
      message,
    };
  }
  const affected =
    updateResultOrBool.affected ||
    _.get(updateResultOrBool, 'raw.affectedRows');

  if (affected === 1) {
    return {
      success: true,
      message: '更新成功',
    };
  } else if (affected === 0) {
    return {
      success: false,
      message: '数据不存在',
    };
  }
  return {
    success: false,
    message: '更新失败',
  };
}
