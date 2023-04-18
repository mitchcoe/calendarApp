import Event from "./Event";

/** @jsx jsx */
/** @jsxRuntime classic */
// eslint-disable-next-line no-unused-vars
import { css, jsx } from '@emotion/react'

export default function EventsContainer(props) {
  const { events, handleClick } = props;
  // console.log(events)
  const eventContainerStyles = { //this doesnt seem to do anything
    // position: 'absolute',
    // display: 'flex',
    // maxWidth: 'calc(100vw - 144px)',
    // width: '100vw',
    // transform: `translateY(-800px) translateX(96px)`,
    // paddingRight: '16px',
    // marginRight: '-16px',
    // zIndex: 900
  };
  return (
    <div css={eventContainerStyles} data-testid="event_container">
      {events.map((eventItem, index) => (
        <Event
          key={eventItem.event_id}
          event={eventItem}
          zIndex={index}
          handleClick={handleClick}
          color={eventItem.color}
        />
      ))}
    </div>
  )
};
