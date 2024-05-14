/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
const stripePublicKey =
  'pk_test_51PFuCMRub7i7qxAVJp7FrXvtlIMo3mqtyCsFtDZqFYQ9dCW0ncruYgq87o4p3QuTMMMSP3x9NB4qGfzoGbJmY16m007OrYM3ID';
const stripe = Stripe(stripePublicKey);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`,
    );

    // 2) Create checkout form + change from credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
