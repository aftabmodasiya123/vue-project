import store from './../store';

const authGuard = (to, from, next) => {
    
    const fn = () => {
        // If the user is authenticated, continue with the route
        if (store.getters.isAuthenticated == true && to.name === 'login') {
            return next({ name: 'home' });
        }
        else next();
    };

    return fn();
};

export default authGuard;