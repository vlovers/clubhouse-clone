import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { ConversationCard } from '../components/ConversationCard';
import { StartRoomModal } from '../components/StartRoomModal';
import Link from 'next/link';
import React from 'react';
import Head from 'next/head';
import { checkAuth } from '../utils/checkAuth';
import { Api } from '../api';
import { Room } from '../api/RoomApi';
import { GetServerSideProps, NextPage } from 'next';

interface RoomPageProps {
  rooms: Room[];
}

const RoomPage: NextPage<RoomPageProps> = ({ rooms }) => {
  const [visibleModal, setVisibleModal] = React.useState(false);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Clubhouse: Drop-in audio chat</title>
      </Head>
      <Header />
      <div className="container">
        <div className=" mt-40 d-flex align-items-center justify-content-between">
          <h1>All conversations</h1>
          <Button onClick={() => setVisibleModal(true)} color="green">
            + Start room
          </Button>
        </div>
        {visibleModal && <StartRoomModal onClose={() => setVisibleModal(false)} />}
        <div className="grid mt-30">
          {rooms.map((obj) => (
            <Link key={obj.id} href={`/rooms/${obj.id}`}>
              <a className="d-flex">
                <ConversationCard
                  title={obj.title}
                  avatars={[]}
                  speakers={obj.speakers}
                  listenersCount={obj.listenersCount}
                />
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<RoomPageProps> = async (ctx) => {
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

    const rooms = await Api(ctx).getRooms();

    return {
      props: {
        rooms,
      },
    };
  } catch (error) {
    console.log('ERROR!');
    return {
      props: {
        rooms: [],
      },
    };
  }
};

export default RoomPage;
