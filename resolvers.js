const { RESTDataSource } = require('apollo-datasource-rest');
import Note from './models/note';
import User from './models/user';
import Quiz from './models/quiz';
import vader from './services/sentiment';

var ObjectId = require('mongoose').Types.ObjectId;
var floatVal = require('mongoose').Types.Decimal128;


export const resolvers = {
    Query: {
        async getSentiment(parent, args) {
            if(args.text) {
                return vader.SentimentIntensityAnalyzer.polarity_scores(args.text);
            }
            return [];
        },
        async searchNotes(parent, args) {
            let notes = [];
            if(args.search === 'subject') {
                let value = new RegExp(args.value, 'i');
                notes = await Note.find({course : {$regex: value}});
            }
            if(args.search === 'email') {
                let user = await User.find({email : args.value.toLowerCase()});
                if(user.length === 0) return [];
                notes = await Note.find({user: new ObjectId(user[0]._id)});
            }
            if(args.search === 'platform') {
                notes = await Note.find({platform: args.value});
            }
            if(args.search === 'verb') {
                notes = await Note.find({verb: args.value});
            }
            if(args.search === 'title') {
                let value = new RegExp(args.value, 'i');
                notes = await Note.find({title : {$regex: value}});
            }
            return notes;
        },

        async getQuiz(parent, args) {
            /* let quizzes = await Quiz.aggregate([
                {
                    $group: {
                        _id: {
                            user: '$user',
                            title: '$title',
                            rawScore: '$rawScore'
                        },
                        count: {
                            $sum: 1
                        }
                    }
                }
            ]); */
            let quizzes = [];
            if(args.search === 'subject') {
                let value = new RegExp(args.value, 'i');
                quizzes = await Quiz.find({course : {$regex: value}});
            }
            if(args.search === 'email') {
                let user = await User.find({email : args.value.toLowerCase()});
                if(user.length === 0) return [];
                quizzes = await Quiz.find({user: new ObjectId(user[0]._id)});
            }
            if(args.search === 'platform') {
                quizzes = await Quiz.find({platform: args.value});
            }
            if(args.search === 'verb') {
                quizzes = await Quiz.find({verb: args.value});
            }
            if(args.search === 'title') {
                let value = new RegExp(args.value, 'i');
                quizzes = await Quiz.find({title : {$regex: value}});
            }

            return quizzes;

        },
        async getOccupations (parent, args, { dataSources }) {
            let occupations = await dataSources.esco.fetchOccupations(args.search);
            let list = occupations._embedded.results.reduce( (occ, curr) => {
                occ.push(curr._links.self);
                return occ;
            }, []);

            let final = list.map(async(res) => {
                let skills = await dataSources.esco.skills(res.href);
                let sk = skills._links.hasEssentialSkill.reduce( (acc, cu) => {
                    acc.push({'title': cu.title, 'uri': cu.uri});
                    return acc;
                }, []);
                return { title: res.title, uri: res.uri, skills: sk};
            });

            const fin = await Promise.all(final);

            return fin;
        }
    },
    Note: {
        async author(note) {
            const usr = await User.find({_id: note.user.toString()});
            let results = {};
            results = usr[0];
            results.role = results.email.indexOf('@student')!== -1 ? 'student' : 'instructor';
            return results;
        },
        sentiment(note) {
            return vader.SentimentIntensityAnalyzer.polarity_scores(note.text);
        }
    },
    Quiz: {
        async author(quiz) {
            const usr = await User.find({_id: quiz.user.toString()});
            let results = {};
            results = usr[0];
            results.role = results.email.indexOf('@student')!== -1 ? 'student' : 'instructor';
            return results;
        },
        score(quiz) {
            return parseFloat(quiz.rawScore);
        }
    }
};
