import React from 'react';
import { formatMessage } from 'umi/locale';
import QtlException from '@/components/QtlException';

const Exception403 = () => (
  <QtlException
    errCode="403"
    errMessage={formatMessage({ id: 'app.exception.description.403' })}
  />
);

export default Exception403;
