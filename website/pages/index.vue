<template>
  <div class="min-h-screen bg-gray-100">
    <div class="z-1 w-full h-40 bg-teal-400">
    </div>
    <div class="relative -mt-20 flex justify-center">
      <div class="w-full max-w-md bg-white rounded-md shadow-xl">
        <div class="h-96 p-8">
          <p class="pb-4 text-center text-2xl font-semibold">PointCash</p>
          <div class="relative">
            <input type="text" id="floating_input"
              class="peer block w-full px-2.5 pt-5 pb-2.5 text-base text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-teal-600"
              placeholder=" " />
            <label for="floating_input"
              class="absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-teal-600">
              Username
            </label>
          </div>
          <div class="relative">
            <input type="text" id="floating_input"
              class="peer block w-full px-2.5 pt-5 pb-2.5 text-base text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-teal-600"
              placeholder=" " />
            <label for="floating_input"
              class="absolute text-base text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-teal-600">
              Password
            </label>
          </div>
          <div class="py-4 flex justify-between">
            <div>
              <input id="default-checkbox" type="checkbox" value="" class="w-4 h-4 border border-default-medium rounded-xs bg-neutral-secondary-medium focus:ring-2 focus:ring-brand-soft">
              <label for="default-checkbox" class="select-none ms-2">Remember Me ?</label>
            </div>
            <div>
              <p class="hover:underline hover:text-blue-400">forgot password ?</p>
            </div>
          </div>
          <button class="w-full bg-blue-500 px-2 py-2 rounded-md hover:bg-blue-300 hover:text-gray-700">Login</button>
          <div class="border-t-2 mt-8 border-gray-400 flex justify-end">
            <small class="pt-2">by : @salmalfarisi</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>