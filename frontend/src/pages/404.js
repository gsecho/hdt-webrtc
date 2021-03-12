import React from 'react';
import { formatMessage } from 'umi/locale';
import QtlException from '@/components/QtlException';

const Exception404 = () => (
  <QtlException
    errCode="404"
    errMessage={formatMessage({ id: 'app.exception.description.404' })}
  />
);

export default Exception404;
