import React from 'react';
import { BackButton } from '../../components/BackButton';
import { Header } from '../../components/Header';
import { Room } from '../../components/Room';
import { wrapper } from '../../redux/store';
import { checkAuth } from '../../utils/checkAuth';

import { Api } from '../../api';

export default function RoomPage({ room }) {
  return (
    <>
      <Header />
      <div className="container mt-40">
        <BackButton title="All rooms" href="/rooms" />
      </div>
      <Room title={room.title} />
    </>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(async (ctx) => {
  try {
    const user = await checkAuth(ctx);

    if (!user) {
      return {
        props: {},
        redirect: {
          permanent: false,
          destination: '/',
        },
      };
    }

    const roomId = ctx.query.id;
    const room = await Api(ctx).getRoom(roomId as string);
    return {
      props: {
        room,
      },
    };
  } catch (error) {
    console.log('ERROR!');
    return {
      props: {},
      redirect: {
        destination: '/rooms',
        permanent: false,
      },
    };
  }
});
