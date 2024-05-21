const { MongoClient, ServerApiVersion } = require('mongodb');
const { seedDatabase } = require('./seedDatabase.js');
require('dotenv').config();

async function createEpisodeExercise(client) {
  /**
   * We forgot to add the last episode of season 9. It has this information:
   */
  try {
    const db = client.db('databaseWeek3');
    const episodesCollection = db.collection('bob_ross_episodes');

    // missing episode obj to insert into DB collection of bob ross episodes
    const missedEpisode = {
      season: 9,
      episode: 'S09E13',
      title: 'MOUNTAIN HIDE-AWAY',
      elements: ['CIRRUS', 'CLOUDS', 'CONIFER', 'DECIDIOUS', 'GRASS', 'MOUNTAIN', 'MOUNTAINS', 'RIVER', 'SNOWY_MOUNTAIN', 'TREE', 'TREES']
    }
  
    const result = await episodesCollection.insertOne(missedEpisode);

    console.log(`Created season 9 episode 13 and the document got the id ${result.insertedId}`);

  } catch (error) {
    console.log(error);
  }
}

async function findEpisodesExercises(client) {
  // Find the title of episode 2 in season 2 [Should be: WINTER SUN]
  const db = client.db('databaseWeek3');
  const episodesCollection = db.collection('bob_ross_episodes');
  const episodeTwo = await episodesCollection.findOne({ episode: 'S02E02' });
  console.log(
    `The title of episode 2 in season 2 is ${episodeTwo.title}`
  );

  // Find the season and episode number of the episode called 'BLACK RIVER' [Should be: S02E06]
  const blackRiver = await episodesCollection.findOne({ title: 'BLACK RIVER' });
  console.log(
    `The season and episode number of the 'BLACK RIVER' episode is ${blackRiver.episode}`
  );

  // Find all of the episode titles where Bob Ross painted a CLIFF [Should be: NIGHT LIGHT, EVENING SEASCAPE, SURF'S UP, CLIFFSIDE, BY THE SEA, DEEP WILDERNESS HOME, CRIMSON TIDE, GRACEFUL WATERFALL]
  const allCliffEpisodes = await episodesCollection.find({ elements: 'CLIFF' }).toArray();
  const cliffEpisodeTitles = allCliffEpisodes.map(episode => episode.title);
  console.log(
    `The episodes that Bob Ross painted a CLIFF are ${cliffEpisodeTitles}`
  );

  // Find all of the episode titles where Bob Ross painted a CLIFF and a LIGHTHOUSE [Should be: NIGHT LIGHT]
  const allCliffAndLighthouseEpisodes = await episodesCollection.find({ elements: { $all: ['CLIFF', 'LIGHTHOUSE'] } }).toArray();
  const cliffAndLighthouseEpisodeTitles = allCliffAndLighthouseEpisodes.map(episode => episode.title);
  console.log(
    `The episodes that Bob Ross painted a CLIFF and a LIGHTHOUSE are ${cliffAndLighthouseEpisodeTitles}`
  );
}

async function updateEpisodeExercises(client) {
  const db = client.db('databaseWeek3');
  const episodesCollection = db.collection('bob_ross_episodes');

  // Episode 13 in season 30 should be called BLUE RIDGE FALLS, yet it is called BLUE RIDGE FALLERS now. Fix that
  const updateResult = await episodesCollection.updateOne({ episode: 'S30E13' }, { $set: { title: 'BLUE RIDGE FALLS' } });
  console.log(`Ran a command to update episode 13 in season 30 and it updated ${updateResult.modifiedCount} episodes`);

  // Unfortunately we made a mistake in the arrays and the element type called 'BUSHES' should actually be 'BUSH' as sometimes only one bush was painted.
  // Update all of the documents in the collection that have `BUSHES` in the elements array to now have `BUSH`
  // It should update 120 episodes!
  const updateBushesResult = await episodesCollection.updateMany({ elements: 'BUSHES' }, { $set: { 'elements.$': 'BUSH' } });
  console.log(`Ran a command to update all the BUSHES to BUSH and it updated ${updateBushesResult.modifiedCount} episodes`);
}

async function deleteEpisodeExercise(client) {
  const db = client.db('databaseWeek3');
  const episodesCollection = db.collection('bob_ross_episodes');

  /*
   * It seems an errand episode has gotten into our data.
   * This is episode 14 in season 31. Please remove it and verify that it has been removed!
  */
  const deleteResult = await episodesCollection.deleteOne({ episode: 'S31E14' });
  console.log(`Ran a command to delete episode and it deleted ${deleteResult.deletedCount} episodes`);
}

async function main() {
  if (process.env.MONGODB_URL == null) {
    throw Error(
      `You did not set up the environment variables correctly. Did you create a '.env' file and add a package to create it?`
    );
  }
  const client = new MongoClient(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();

    // Seed our database
    await seedDatabase(client);

    // CREATE
    await createEpisodeExercise(client);

    // READ
    await findEpisodesExercises(client);

    // UPDATE
    await updateEpisodeExercises(client);

    // DELETE
    await deleteEpisodeExercise(client);
  } catch (err) {
    console.error(err);
  } finally {
    // Always close the connection at the end
    client.close();
  }
}

main();

/**
 * In the end the console should read something like this: 

Created season 9 episode 13 and the document got the id 625e9addd11e82a59aa9ff93
The title of episode 2 in season 2 is WINTER SUN
The season and episode number of the 'BLACK RIVER' episode is S02E06
The episodes that Bob Ross painted a CLIFF are NIGHT LIGHT, EVENING SEASCAPE, SURF'S UP, CLIFFSIDE, BY THE SEA, DEEP WILDERNESS HOME, CRIMSON TIDE, GRACEFUL WATERFALL
The episodes that Bob Ross painted a CLIFF and a LIGHTHOUSE are NIGHT LIGHT
Ran a command to update episode 13 in season 30 and it updated 1 episodes
Ran a command to update all the BUSHES to BUSH and it updated 120 episodes
Ran a command to delete episode and it deleted 1 episodes
 
*/