module.exports = {

    'secret': 'allvoting',
    //'database': process.env.MONGOLAB_URI || 'mongodb://allvoting:Moon1234@127.0.0.1:27017/allvoting'
    'database': process.env.MONGOLAB_URI || 'mongodb://allvoting:allvoting@127.0.0.1:27017/all-voting'
    //'database': 'mongodb://allvoting:allvoting@192.168.106.128:27017/all-voting'

};