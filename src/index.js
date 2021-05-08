const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
];

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (parent, { id }) => {
      const link = links.find((l) => l.id === id);
      return link;
    },
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${links.length}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
    },
    updateLink: (parent, { id, url, description }) => {
      const updatedLink = {
        id,
        url,
        description,
      };
      links = links.map((l) => (l.id === id ? updatedLink : l));

      return updatedLink;
    },
    deleteLink: (parent, {id}) => {
      const deletedLinkIndex = links.findIndex(l => l.id === id);
      
      if(!deletedLinkIndex){
        return null
      }
      
      const deletedItem = links[deletedLinkIndex];
      links.splice(deletedLinkIndex, 1);

      return deletedItem;
    }
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
});

server.listen().then(({ url }) => console.log(`server is running on ${url}`));
