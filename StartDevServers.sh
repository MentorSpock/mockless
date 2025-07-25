#!/bin/bash

start_container() {
    container_name="mockless"
    if ! docker ps -aq -f name=^${container_name}$ | grep -q .; then
        echo "Creating and starting container '${container_name}'..."
        docker run \
            -v $(pwd):/programs \
            -w /programs \
            --name $container_name \
            -p 4200:4200 \
            angular:16 \
                sleep 3600
        return
    fi

    if ! docker ps -q -f name=^${container_name}$ | grep -q .; then
        echo "Starting existing container '${container_name}'..."
        docker start "${container_name}"
        return
    fi

    echo "Container '${container_name}' is already running."
}

start_processes() {
    docker exec -d mockless ng build mockless --watch
    docker exec -d mockless ng serve mockless-demo --disable-host-check --host=0.0.0.0
}

start_container
start_processes