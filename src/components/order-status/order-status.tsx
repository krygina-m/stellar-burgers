/*import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusText: { [key: string]: string } = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  let textStyle = '';
  switch (status) {
    case 'pending':
      textStyle = '#E52B1A';
      break;
    case 'done':
      textStyle = '#00CCCC';
      break;
    default:
      textStyle = '#F2F2F3';
  }

  return <OrderStatusUI textStyle={textStyle} text={statusText[textStyle]} />;
};*/

import React, { FC } from 'react';
import { OrderStatusProps } from './type';
import { OrderStatusUI } from '@ui';

const statusText: { [key: string]: string } = {
  pending: 'Готовится',
  done: 'Выполнен',
  created: 'Создан'
};

const statusColor: { [key: string]: string } = {
  pending: '#E52B1A',
  done: '#00CCCC',
  created: '#F2F2F3'
};

export const OrderStatus: FC<OrderStatusProps> = ({ status }) => {
  // Получаем текст статуса
  const text = statusText[status] || 'Неизвестно';

  // Получаем цвет для текста
  const textStyle = statusColor[status] || '#F2F2F3';

  return <OrderStatusUI textStyle={textStyle} text={text} />;
};
