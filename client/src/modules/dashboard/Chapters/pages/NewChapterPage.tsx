import { NextPage } from 'next';

import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {
  CreateChapterInputs,
  useCreateChapterMutation,
} from '../../../../generated/graphql';
import { CHAPTERS } from '../../../chapters/graphql/queries';
import { Layout } from '../../shared/components/Layout';
import ChapterForm from '../components/ChapterForm';

export const NewChapterPage: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [createChapter] = useCreateChapterMutation({
    refetchQueries: [{ query: CHAPTERS }],
  });

  const onSubmit = async (inputData: CreateChapterInputs) => {
    setLoading(true);
    try {
      // ToDo: handle empty data differently
      const { data } = await createChapter({
        variables: { data: { ...inputData } },
      });
      router.replace(`/dashboard/chapters/${data?.createChapter.id}/new-venue`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <ChapterForm
        loading={loading}
        onSubmit={onSubmit}
        loadingText={'Adding Chapter'}
        submitText={'Add chapter'}
      />
    </Layout>
  );
};
