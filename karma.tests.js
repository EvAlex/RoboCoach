var context = require.context('./js', true, /-test\.tsx?$/);
context.keys().forEach(context);
