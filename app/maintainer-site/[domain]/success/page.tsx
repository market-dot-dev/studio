'use client';

import PrimaryButton from '@/components/common/link-button';

const AdminIndex = () => {
  return (
    <div>
      <h1>Success!</h1>
      <div>
        Click here to go to gitwallet and manage your subscriptions
        <PrimaryButton href="http://app.gitwallet.local:3000/" label="Go to gitwallet" />
      </div>
    </div>
  );
};

export default AdminIndex;