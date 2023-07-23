import Card from "./UI/Card";

const EventlistView = ({ titleText, cardsData }) => {
  return (
    <div className="text-white mt-8">
      <div className="text-2xl font-semibold mb-5">{titleText}</div>
      <div className="w-full flex flex-wrap space-x-4">
        {
          // cardsData will be an array
          cardsData.map((item) => {
            return (
              <Card
                key={item._id}
                _id={item._id}
                title={item.name}
                description={item.description}
                date={item.eventDate}
                imgUrl={
                  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80"
                }
              />
            );
          })
        }
      </div>
    </div>
  );
};

export default EventlistView;
