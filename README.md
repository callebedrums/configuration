# Configuration

A small library to manage configuration.

The Configuration Library should be used to hold the true state of the configuration.

Set the configuration in the bootstrap of your application, and consult it to retrieve configuration values.

## Set initial configuration

To set the initial configuration, use the *set* method with an object as argument

```JavaScript
/* Bootstrap file for your application */
import { configuration } from 'configuration';

// Read configuration from file, env vars or from http call
// Static configuration as example
const config = {
    services: {
        users: 'https://domain.com/users'
    },
    retries: 3
}

// set configuration
configuration.set(config);
```

If you have multiple sources of configuration, you can set multiple times and the *set* method will merge the configurations.
The last configuration set will overwrite any attribute previously configured, so the order matters.

```JavaScript
const config1 = {
    title: 'My Title',
    retries: 3,
    services: 'domain.com'
};

const config2 = {
    retries: 4,
    timeout: 1000,
    services: {
        users: 'domain.com/users'
    }
};

configuration.set(config1);
/*
final configuration
{
    retries: 3,
    services: 'domain.com'
}
*/

configuration.set(config2);
/*
final configuration
{
    title: 'My Title',
    retries: 4,
    timeout: 1000
    services: {
        users: 'domain.com/users'
    }
}
*/
```

## Read configuration

To read any configuration, use the *get* method with a string path of the configuration attribute you want to read.

If not found, the *get* method returns *undefined*.

```JavaScript
// initial configuration in the bootstrap
configuration.set({
    retries: 3,
    services: {
        users: 'domain.com/users'
    }
})

// ...

// consuming configuration from application files

// returns a string
const userService = configuration.get('services.users');

// returns an object
const services = configuration.get('services');

// returns the number 3
const retries = configuration.get('retries');

// returns undefined
const retries = configuration.get('timeout');
const retries = configuration.get('services.clients');
```

If using ES6 or TypeScript with decorators enabled, use the configuration as a decorator in any attribute of your class. When you instantiate a new instance of the class, the attribute will be populated with the configuration value.

```TypeScript
// initial configuration in the bootstrap
configuration.set({
    retries: 3,
    services: {
        users: 'domain.com/users'
    }
})

class MyClass {

    @configuration('retries')
    retries: number;

    @configuration('service.users')
    private userService: string;

    getUserService(): string {
        return this.userService;
    }
}

let instance = new MyClass();

console.log(instance.retries) // > 3
console.log(instance.getUserService()) // > domain.com/users
```

As you can see, it also works for private attributes.

The configuration decorator will replace the original attribute descriptor with a new one that implements a getter, but no a setter. This means that attributes with the configuration decorator are *read only*, and if the configuration changes, the attribute value also changes.
