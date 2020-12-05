/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';
import * as React from 'react';

export const OrderTotal: React.FC<any> = (props: BasePropertyProps) => {
  return (
    <Box>{props.record.params['total']} €</Box>
  )
}

export default OrderTotal;


