package com.magneqapp

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
<<<<<<< HEAD
import android.os.Bundle;
=======
>>>>>>> 366337f5fd26645a8daa3eff1d3c04f83682df08

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "MagneqApp"

<<<<<<< HEAD
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
  }
=======
>>>>>>> 366337f5fd26645a8daa3eff1d3c04f83682df08
  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
<<<<<<< HEAD
  
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

=======
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
>>>>>>> 366337f5fd26645a8daa3eff1d3c04f83682df08
}
