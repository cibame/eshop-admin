/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Link } from '@admin-bro/design-system';
import { BasePropertyProps, ViewHelpers } from 'admin-bro';
import * as React from 'react';

export const OrderProdct: React.FC<any> = (props: BasePropertyProps) => {
    const url = new ViewHelpers().resourceUrl({ resourceId: 'OrderProduct', search: `?filters.orderId=${props.record.params.id}`});
  return (
      <Box><Link href={url} mr="xl">Link</Link></Box>
  )
}

export default OrderProdct;
