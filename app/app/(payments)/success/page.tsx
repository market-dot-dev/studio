'use server';

import DomainService from '@/app/services/domain-service';
import { redirect } from 'next/navigation';

const SubscriptionSuccess = () => {
  redirect(DomainService.getRootUrl('app', '/packages'));
};

export default SubscriptionSuccess;