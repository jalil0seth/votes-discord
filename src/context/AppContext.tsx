// Add to your reducer
case 'JOIN_TOPIC':
  return {
    ...state,
    topics: state.topics.map(topic =>
      topic.id === action.payload.topicId
        ? {
            ...topic,
            participants: [
              ...(topic.participants || []),
              {
                id: crypto.randomUUID(),
                name: 'Anonymous User',
                joinedAt: new Date()
              }
            ]
          }
        : topic
    )
  };

case 'TOGGLE_SERVER_CONFIG':
  return {
    ...state,
    isServerConfigOpen: !state.isServerConfigOpen
  };