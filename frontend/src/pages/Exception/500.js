import React from 'react';
import { formatMessage } from 'umi/locale';
import QtlException from '@/components/QtlException';

const Exception500 = () => (
  <QtlException
    errCode="500"
    errMessage={formatMessage({ id: 'app.exception.description.500' })}
  />
);
export default Exception500;
