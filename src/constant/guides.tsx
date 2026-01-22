import AboutLudiumIcon from '@/assets/icons/guide/about-ludium.svg';
import JoinProjectIcon from '@/assets/icons/guide/join-project.svg';
import SetUpProfileIcon from '@/assets/icons/guide/setup-profile.svg';

export const GUIDES = [
  {
    id: 'about-ludium',
    link: '/about/guides/about-ludium',
    title: (
      <>
        About
        <br />
        Ludium
      </>
    ),
    pageTitle: 'About Ludium',
    bgColor: 'bg-primary-400',
    icon: AboutLudiumIcon,
    content: ``,
  },
  {
    id: 'join-project',
    link: '/about/guides/join-project',
    title: (
      <>
        Join
        <br />a Project
      </>
    ),
    pageTitle: 'Join a Project',
    bgColor: 'bg-sky-500',
    icon: JoinProjectIcon,
    content: ``,
  },
  {
    id: 'setup-profile',
    link: '/about/guides/setup-profile',
    title: (
      <>
        Set Up
        <br />
        Profile
      </>
    ),
    pageTitle: 'Set Up Profile',
    bgColor: 'bg-rose-500',
    icon: SetUpProfileIcon,
    content: ``,
  },
];
