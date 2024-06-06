import TierService from '@/app/services/TierService';
import prisma from '@/lib/prisma';

import { createTier, createUser } from '@/tests/factories';
import { Sql } from '@prisma/client/runtime/library';

const nukeDb = async () => {
  await prisma.$queryRaw(new Sql(['TRUNCATE TABLE "Tier" CASCADE;'], []));
  await prisma.$queryRaw(new Sql(['TRUNCATE TABLE "User" CASCADE;'], []));
}

describe('TierService update', () => {
  beforeEach(async () => {
    //await nukeDb();
    await prisma.$queryRaw(new Sql(['BEGIN;'], []));
  });

  afterEach(async () => {
    await prisma.$queryRaw(new Sql(['ROLLBACK;'], []));    
  });

  it('should create and retrieve a user successfully', async () => {
    const user = await createUser({email: 'aaron@graves.com'});
    const retrievedUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    expect(retrievedUser).not.toBeNull();
    expect(retrievedUser?.email).toEqual('aaron@graves.com');
  });

  it('queries by id and returns a tier if found', async () => {
    const user = await createUser({email: 'aaron@graves.com'});
    const tier = await createTier(user.id, {name: 'Gold'});

    const retrievedTier = await TierService.findTier(tier.id);
    
    expect(retrievedTier).not.toBeNull();
    expect(retrievedTier?.userId).toEqual(user.id);
    expect(retrievedTier?.name).toEqual('Gold');
  });
});