import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';
import Peer from 'simple-peer';
import { useRouter } from 'next/router';
import { Button } from '../Button';
import { Speaker } from '../Speaker';

import styles from './Room.module.scss';
import { selectUserData } from '../../redux/selectors';
import { useSelector } from 'react-redux';
import { UserData } from '../../pages';
import { useSocket } from '../../hooks/useSocket';

interface RoomProps {
  title: string;
}

export const Room: React.FC<RoomProps> = ({ title }) => {
  const router = useRouter();
  const user = useSelector(selectUserData);
  const [users, setUsers] = React.useState<UserData[]>([]);
  const roomId = router.query.id;
  const socket = useSocket();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {
          const peerIncome = new Peer({
            initiator: true,
            trickle: false,
            stream,
          });

          peerIncome.on('signal', (signal) => {
            socket.emit('CLIENT@ROOMS:CALL', {
              user,
              roomId,
              signal,
            });
          });

          socket.on('SERVER@ROOMS:CALL', ({ user: callerUser, signal }) => {
            console.log(user, signal, 'ПРИШЕЛ СИГШНГАЩФЫВЛ!');

            const peerOutcome = new Peer({
              initiator: false,
              trickle: false,
              stream,
            });

            peerOutcome.signal(signal);

            peerOutcome
              .on('stream', (stream) => {
                document.querySelector('audio').srcObject = stream;
                document.querySelector('audio').play();
                console.log('STREAM', stream);
              })
              .on('signal', (signal) => {
                console.log(callerUser);
                socket.emit('CLIENT@ROOMS:ANSWER', {
                  targetUserId: callerUser.id,
                  roomId,
                  signal,
                });
              });
          });

          socket.on('SERVER@ROOMS:ANSWER', ({ targetUserId, signal }) => {
            if (user.id === targetUserId) {
              peerIncome.signal(signal);
              console.log('МЫ ОТВЕТИЛИ ЮЗЕРУ', targetUserId);
            }
          });
        })
        .catch(() => {
          console.error('Нет доступа к микрофону');
        });

      socket.emit('CLIENT@ROOMS:JOIN', {
        user,
        roomId,
      });

      socket.on('SERVER@ROOMS:LEAVE', (user: UserData) => {
        setUsers((prev) => prev.filter((obj) => obj.id !== user.id));
      });

      socket.on('SERVER@ROOMS:JOIN', (allUsers) => {
        console.log(allUsers);
        setUsers(allUsers);
      });
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <audio controls />
      <div className="d-flex align-items-center justify-content-between">
        <h2>{title}</h2>
        <div className={clsx('d-flex align-items-center', styles.actionButtons)}>
          <Link href="/rooms">
            <a>
              <Button color="gray" className={styles.leaveButton}>
                <img width={18} height={18} src="/static/peace.png" alt="Hand black" />
                Leave quietly
              </Button>
            </a>
          </Link>
        </div>
      </div>

      <div className="users">
        {users.map((obj) => (
          <Speaker key={obj.fullname} {...obj} />
        ))}
      </div>
    </div>
  );
};
