import React from 'react';
import { formatMessage } from 'umi/locale';
import QtlException from '@/components/QtlException';

const ExceptionSin = () => (
  <QtlException
    errCode={formatMessage({ id: 'hdt.exception.title.sin' })}
    codeStyle={{fontSize:'45px',lineHeight:1.61}}
    errText='Notice'
    errMessage={formatMessage({ id: 'hdt.exception.description.sin' })}
  />
);

export default ExceptionSin;
