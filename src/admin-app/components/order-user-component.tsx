/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box } from '@admin-bro/design-system';
import { BasePropertyProps } from 'admin-bro';
import * as React from 'react';

export const OrderTotal: React.FC<any> = (props: BasePropertyProps) => {
  const name = props.record.populated['userId'].params['firstMame'];
  const surname = props.record.populated['userId'].params['lastName']
  console.log(props);
  return (
    <Box>{name}  {surname}</Box>
  )
}

export default OrderTotal;


