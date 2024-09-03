import { defineEventHandler, H3Error, sendError } from 'h3';

export default defineEventHandler(async (event) => {
  try {
    // Allow the request to proceed as usual
    await  event.node.res; // This will trigger the next middleware or handler

  } catch (error) {
    // Log the error to the console
    console.error('SSR Error captured:', error);

    // Optionally, send a custom error response
    const customError = new H3Error('Internal Server Error');
    customError.statusCode = 500;
    customError.data = { message: 'Something went wrong!' };
    
    // Send the error response
    sendError(event, customError);
  }
});
