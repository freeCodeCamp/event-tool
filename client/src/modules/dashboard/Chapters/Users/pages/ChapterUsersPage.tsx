import React from 'react';
import { NextPage } from 'next';

import { useChapterUsersQuery } from '../../../../../generated/graphql';
import { Layout } from '../../../shared/components/Layout';
import { VStack, Flex, Text, Heading } from '@chakra-ui/react';
import { DataTable } from 'chakra-data-table';
import { LinkButton } from 'chakra-next-link';
import { getId } from 'helpers/getId';
import { useRouter } from 'next/router';

export const ChapterUsersPage: NextPage = () => {
  const router = useRouter();

  const id = getId(router.query) || -1;

  const { loading, error, data } = useChapterUsersQuery({
    variables: { id },
  });

  return (
    <Layout>
      <VStack>
        <Flex w="full" justify="space-between">
          <Heading id="pageTitle">Chapter Users</Heading>
          <LinkButton href={`/dashboard/chapters/${id}/users/new`}>
            Invite user
          </LinkButton>
        </Flex>
        {loading ? (
          <Heading>Loading...</Heading>
        ) : error || !data?.chapter?.users ? (
          <>
            <Heading>Error</Heading>
            <Text>
              {error?.name}: {error?.message}
            </Text>
          </>
        ) : (
          <DataTable
            data={data.chapter.users}
            tableProps={{ table: { 'aria-labelledby': 'pageTitle' } }}
            keys={['name', 'email'] as const}
            mapper={{
              name: ({ user }) => user.name,
              email: ({ user }) => user.email,
            }}
          />
        )}
      </VStack>
    </Layout>
  );
};
